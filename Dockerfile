# Use the official Node.js 20 image as the base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

FROM build AS production

COPY --from=build /src/.next ./.next
COPY --from=build /src/public ./public
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/package.json ./package.json
  
COPY --from=build /src/.env ./.env


RUN npm install

# Start the Next.js application
CMD ["npm", "start"]