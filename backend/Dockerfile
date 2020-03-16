# Start with a base image containing Java runtime
FROM openjdk:8-jdk-alpine as build

RUN mkdir -p /l8z/server
WORKDIR /l8z/server

COPY pom.xml .

RUN mkdir -p /src
COPY src/ src/

RUN mkdir -p /target
COPY target/l8z-1.0.0-SNAPSHOT.jar target/
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM openjdk:8-jre-alpine

ARG DEPENDENCY=/l8z/server/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Run the jar file
ENTRYPOINT ["java","-cp","app:app/lib/*","com.l8z.L8zApplication"]
