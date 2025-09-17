export async function createShopifyOrder(
  pdfUrl: string,
  variantId: string,
  customerEmail: string,
  additionalAttributes: Record<string, string> = {}
): Promise<{ checkoutUrl: string }> {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Convert additional attributes to Shopify line item attributes
  const extraAttributes = Object.entries(additionalAttributes).map(([key, value]) => ({
    key,
    value
  }));

  const variables = {
    input: {
      lines: [
        {
          merchandiseId: variantId,
          quantity: 1,
          attributes: [
            {
              key: "pdf_url",
              value: pdfUrl
            },
            ...extraAttributes
          ]
        }
      ],
      buyerIdentity: {
        email: customerEmail
      }
    }
  };

  const response = await fetch(`https://` + import.meta.env.VITE_SHOPIFY_STORE_DOMAIN + `/api/2023-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();
  console.log('Full Shopify response:', data);

  if (data.errors) {
    console.error('GraphQL Errors:', data.errors);
    throw new Error(data.errors[0].message);
  }

  if (!data.data?.cartCreate) {
    throw new Error('Invalid response structure from Shopify');
  }

  if (data.data.cartCreate.userErrors?.length > 0) {
    console.error('User Errors:', data.data.cartCreate.userErrors);
    throw new Error(data.data.cartCreate.userErrors[0].message);
  }

  return {
    checkoutUrl: data.data.cartCreate.cart.checkoutUrl
  };
}