# Use the official OpenJDK image as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and install dependencies (for Maven)
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the backend project files
COPY . .

# Build the Spring Boot application (this assumes your app uses Maven)
RUN mvn clean install

# Expose port 8080 for the backend
EXPOSE 8080

# Create non-root user and set permissions
RUN useradd -U -u 1000 appuser && \
    chown -R 1000:1000 /app
USER 1000

# Command to run the Spring Boot application
CMD ["java", "-jar", "target/my-backend-app.jar"]
