export default () => {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL) {
      console.error(
          'DATABASE_URL environment variable missing. Shutting down.');
      process.exit();
    }
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error(
        'ACCESS_TOKEN_SECRET environment variable missing. Shutting down.',
    );
    process.exit();
  }

  if (!(process.env.R2_ACCESS_KEY &&
      process.env.R2_SECRET_KEY)) {
    console.warn(
        `
    Image uploading disabled. To enable, set the following environment variables: 
    R2_ACCESS_KEY=<AWS access key ID>
    R2_SECRET_KEY=<AWS secret access key>
    `,
    );
  }
}
