<script>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "vue-sonner";

export default {
  setup(_, { emit }) {
    const stripePromise = loadStripe(process.env.VUE_APP_STRIPE_KEY);
    const cardElement = ref(null);
    const stripe = stripePromise;

    const handleSubmit = async () => {
      const stripeInstance = await stripe;

      const { token, error } = await stripeInstance.createToken(
        cardElement.value
      );
      if (error) {
        throw new Error(error.message || "Something wrong in your card info");
      } else {
        emit("handleToken", token.id);
      }
    };

    onMounted(() => {
      stripe.then((stripeInstance) => {
        const elements = stripeInstance.elements();
        const card = elements.create("card");
        card.mount("#card-element");
        cardElement.value = card;
      });
    });

    const handleSubmitToken = () => {
      toast.promise(handleSubmit, {
        loading: "Loading...",
        success: () => {
          return `Stripe Token Generated Successfully`;
        },
        error: (error) => error.message,
      });
    };

    return {
      handleSubmitToken,
      cardElement,
    };
  },
};
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmitToken" class="stripe__form">
      <label>
        <div ref="cardElement" id="card-element"></div>
      </label>

      <button type="submit">Generate</button>
    </form>
  </div>
</template>
