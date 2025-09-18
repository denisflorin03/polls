# Multi-stage build pentru optimizare
FROM maven:3.8-openjdk-17 AS build

# Setează directorul de lucru
WORKDIR /app

# Copiază pom.xml și descarcă dependențele (pentru cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiază codul sursă
COPY src ./src

# Build aplicația
RUN mvn clean package -DskipTests

# Stage final - runtime
FROM openjdk:17

# Setează directorul de lucru
WORKDIR /app

# Copiază JAR-ul din stage-ul de build
COPY --from=build /app/target/*.jar app.jar

# Expune portul
EXPOSE 8081

# Setează variabilele de mediu
ENV SPRING_PROFILES_ACTIVE=docker

# Comanda de start
ENTRYPOINT ["java", "-jar", "app.jar"]
