FROM pocga/tomcat:latest

WORKDIR /home/node/app

COPY ProductosMock.war /usr/local/tomcat/webapps/ProductosMock.war

EXPOSE 8080

CMD ["catalina.sh", "run"]