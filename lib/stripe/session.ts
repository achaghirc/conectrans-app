export type StripeSession = {
  id: string,
  object: string,
  after_expiration: null | string,
  allow_promotion_codes: null | string,
  amount_subtotal: number,
  amount_total: number,
  automatic_tax: {
    enabled: boolean,
    liability: null | string,
    status: null | string
  },
  billing_address_collection: null | string,
  cancel_url: null | string,
  client_reference_id: null | string,
  consent: null | string,
  consent_collection: null | string,
  created: number,
  currency: string,
  custom_fields: any[],
  custom_text: {
    shipping_address: null | string,
    submit: null | string
  },
  customer: null | string,
  customer_creation: string,
  customer_details: null | string,
  customer_email: null | string,
  expires_at: number,
  invoice: null | string,
  invoice_creation: {
    enabled: boolean,
    invoice_data: {
      account_tax_ids: null | string,
      custom_fields: null | string,
      description: null | string,
      footer: null | string,
      issuer: null | string,
      metadata: Record<string, any>,
      rendering_options: null | string
    }
  },
  livemode: boolean,
  locale: null | string,
  metadata: Record<string, any>,
  mode: string,
  payment_intent: null | string,
  payment_link: null | string,
  payment_method_collection: string,
  payment_method_options: Record<string, any>,
  payment_method_types: string[],
  payment_status: string,
  phone_number_collection: {
    enabled: boolean
  },
  recovered_from: null | string,
  setup_intent: null | string,
  shipping_address_collection: null | string,
  shipping_cost: null | string,
  shipping_details: null | string,
  shipping_options: any[],
  status: string,
  submit_type: null | string,
  subscription: null | string,
  success_url: string,
  total_details: {
    amount_discount: number,
    amount_shipping: number,
    amount_tax: number
  },
  url: string
}