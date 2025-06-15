FROM openjdk:17-jdk AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests

# Stage 2: Run the app
FROM openjdk:17-jdk
WORKDIR /app

COPY --from=build /app/target/BackendPFE-0.0.1-SNAPSHOT.jar app.jar
# Copy your Python script directory (assume it's inside src/main/resources/ml-python)
COPY src/main/resources/ml-python ./ml-python
# Optional: Install Python dependencies
RUN pip3 install --no-cache-dir -r ml-python/requirements.txt || true
EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]




