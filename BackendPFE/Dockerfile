# Stage 1: Build the application
FROM openjdk:17-jdk AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Add this line to give execute permissions to the mvnw script
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests

# Stage 2: Run the app
FROM openjdk:17-jdk
WORKDIR /app

COPY --from=build /app/target/BackendPFE-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]
