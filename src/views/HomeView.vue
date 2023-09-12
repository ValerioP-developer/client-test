<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
  <main>

    <button @click="createCheckoutSession">test</button>
    <div class="content-wrapper">
      <h1>Welcome to Stripe Operations</h1>
      <p>
        Here you can manage your Stripe transactions with ease. Whether you're
        looking to create a checkout session, set up a subscription, or modify
        existing ones, we've got you covered.
        <strong>Select an option below to begin.</strong>
      </p>
      <div>
        <stripe-element v-if="!stripeToken" @handleToken="handleToken"></stripe-element>
      </div>
      <div v-if="stripeToken" class="input-icon-container">
        <input :value="stripeToken" disabled />
        <i class="fas fa-copy icon" @click="() => copyToClipboard(stripeToken)"></i>
      </div>
      <div v-if="checkoutUrl" class="input-icon-container">
        <input :value="checkoutUrl" disabled />
        <i class="fas fa-copy icon" @click="() => copyToClipboard(checkoutUrl)" title="Copy"></i>
      </div>

      <template v-if="stripeToken && contentType === 'SUBSCRIPTION'">
        <div class="select__label">Enter Plan ID:</div>
        <input class="customer__email" v-model="selectedPlan" placeholder="Enter email" />
        <br />
        <div class="select__label">Customer Email:</div>
        <input class="customer__email" :value="customerEmail" @change="handleChangeEmail" placeholder="Enter email" />
      </template>

      <template v-if="stripeToken && contentType === 'DELETE'">
        <div class="select__label">Customer ID:</div>
        <input class="customer__email" v-model="customerId" placeholder="Enter Customer ID" />
      </template>

      <template v-if="stripeToken && contentType === 'UPDATE'">
        <div class="select__label">Enter Plan ID:</div>
        <input class="customer__email" v-model="selectedPlan" placeholder="Enter Plan ID" />
        <br />
        <div class="select__label">Customer ID:</div>
        <input class="customer__email" v-model="customerId" placeholder="Enter Customer ID" />
      </template>
      <br />
      <div class="buttons">
        <template v-if="stripeToken">
          <button v-for="action in actions" :disabled="loading" :key="action.label" @click="action.method">
            {{ action.label }}
          </button>
        </template>
      </div>
    </div>
  </main>
</template>

<script>
import { toast } from "vue-sonner";
import { ref } from "vue";
import stripeElement from '../components/stripe/stripe-element.vue';


const goldPlanId = process.env.VUE_APP_STRIPE_GOLD_PLAN_ID;
const premiumPlanId = process.env.VUE_APP_STRIPE_PREMIUM_PLAN_ID;
const API_BASE_URL_V1 = process.env.VUE_APP_API_BASE_URL_V1;

// Refs
const stripeToken = ref("");
const checkoutUrl = ref("");
const selectedPlan = ref(goldPlanId);
const loading = ref(false);
const subscription = ref(false);
const contentType = ref('');
const customerEmail = ref("");
const customerId = ref("");


// Methods
const createCheckoutSession = async () => {
  alert("test")
  try {
    const response = await fetch(
      //`${API_BASE_URL_V1}/stripe/checkout/sessions`,
      `https://stripe-s2s-e27a00c21c70.herokuapp.com/v1/stripe/checkout/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "System b24b3b0e-9257-466b-949e-8c0c3841eeb5",
        },
        body: JSON.stringify({
          name: "Zohaib Khalid",
          amount: 400
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const createSubscription = async () => {
  try {
    if (!customerEmail.value || !stripeToken.value || !selectedPlan.value) {
      toast.error('All values are required');
      return
    }
    const response = await fetch(`${API_BASE_URL_V1}/stripe/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "System b24b3b0e-9257-466b-949e-8c0c3841eeb5",
      },
      body: JSON.stringify({
        email: customerEmail.value,
        token: stripeToken.value,
        plan_id: selectedPlan.value,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteSubscription = async () => {
  try {
    if (!customerId.value) {
      toast.error('CustomerId are required');
      return
    }
    const response = await fetch(`${API_BASE_URL_V1}/stripe/subscription/${customerId.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "System b24b3b0e-9257-466b-949e-8c0c3841eeb5",
      },
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const updateSubscription = async () => {
  try {
    if (!customerId.value) {
      toast.error('CustomerId are required');
      return
    }
    const response = await fetch(`${API_BASE_URL_V1}/stripe/subscription/${customerId.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "System b24b3b0e-9257-466b-949e-8c0c3841eeb5",
      },
      body: JSON.stringify({
        plan_id: selectedPlan.value
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};



const createCheckoutSessionHandler = () => {
  toast.promise(createCheckoutSession, {
    loading: "Loading...",
    success: (data) => {
      checkoutUrl.value = data.checkoutUrl;
      return `Checkout Session Created Successfully.`;
    },
    error: (error) => error.message,
  });
};

const createSubscriptionHandler = () => {
  if (contentType.value !== 'SUBSCRIPTION') {
    handleUpdateContent('SUBSCRIPTION');
    return;
  }
  toast.promise(createSubscription, {
    loading: "Loading...",
    success: (data) => {
      if (!data) return;
      if (data.error) return data.error;
      return data.subscription.message;
    },
    error: (error) => error.message,
  });
};

const deleteSubscriptionHandler = () => {
  if (contentType.value !== 'DELETE') {
    handleUpdateContent('DELETE');
    return;
  }
  toast.promise(deleteSubscription, {
    loading: "Loading...",
    success: (data) => {
      if (!data) return;
      if (data.error) return data.error;
      return data.message;
    },
    error: (error) => error.message,
  });
}


const updateSubscriptionHandler = () => {
  if (contentType.value !== 'UPDATE') {
    handleUpdateContent('UPDATE');
    return;
  }
  toast.promise(updateSubscription, {
    loading: "Loading...",
    success: (data) => {
      if (!data) return;
      if (data.error) return data.error;
      return data.subscription.message;
    },
    error: (error) => error.message,
  });
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  } catch (err) {
    toast.error("Failed to copy text: " + err);
  }
};

const handlePlanChange = (e) => {
  const { value } = e.target;
  console.log(value);
  selectedPlan.value = value;
  return value;
};

const handleChangeEmail = (e) => {
  const { value } = e.target;
  customerEmail.value = value;
  return value;
};

const handleChangeCheckbox = (e) => {
  const { checked } = e.target;
  subscription.value = checked;
  return checked;
};

const handleUpdateContent = content => {
  contentType.value = content
  return contentType;
}

const actions = [
  {
    label: "Generate New Token",
    method: () => window.location.reload(),
  },
  {
    label: "Create Checkout Session",
    method: createCheckoutSessionHandler,
  },
  {
    label: "Create Subscription",
    method: createSubscriptionHandler,
  },
  {
    label: "Update Subscription",
    method: updateSubscriptionHandler,
  },
  {
    label: "Delete Subscription",
    method: deleteSubscriptionHandler,
  },
];

console.log(contentType.value)

export default {
  components: { stripeElement },
  methods: {
    handleToken(tokenId) {
      stripeToken.value = tokenId;
      return tokenId;
    },
    createCheckoutSession,
    handleChangeCheckbox,
    handleChangeEmail,
    copyToClipboard,
    handlePlanChange,
    handleUpdateContent,
  },
  data() {
    return {
      actions,
      goldPlanId,
      premiumPlanId,
      loading,
      stripeToken,
      subscription,
      selectedPlan,
      contentType,
      checkoutUrl,
      customerId,
    };
  },
};
</script>
