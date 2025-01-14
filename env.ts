const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    apiKey: String(process.env.APPWRITE_API_KEY)
  },
  emails: {
    apikey: String(process.env.RESEND_API_KEY)
  },
  payment: {
    public: String(process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY),
    secret: String(process.env.FLUTTERWAVE_SECRET_KEY),
    encryption: String(process.env.FLUTTERWAVE_ENCRYPTION_KEY),
    hash: String(process.env.SECRET_HASH)
  }
}

export default env;