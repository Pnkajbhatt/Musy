FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]



#Build jar file 
# ./mvnw clean package -DskipTests
#Build docker image 
# docker build -t musy-app .
#run the container
# docker run -p 8080:8080 --env-file .env musy-app
