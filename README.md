# CampusFlow

CampusFlow is a student and administration management web-based system built for "Across" universities. It consists of an admin panel and a student dashboard.

## Technology Stack
- React JS - Frontend
- Django - Backend
- Blazegraph - Graph-based data storage for RDF
- Mysql - Database

## System Requirements
- Operating System
  - Windows
  - MacOS
  - Linux

- Software Requirements
  - [Mysql](https://dev.mysql.com/downloads/installer/)
  - [Blazegraph](https://github.com/blazegraph/blazegraph-python) 
  - [Python >= 3](https://www.python.org/downloads/)
  - [Nodejs >= 16](https://nodejs.org/en/download)
  - [Java >= 8](https://www.oracle.com/java/technologies/downloads/)

- Deployment Requirements
  - AWS RDS - For Mysql
  - AWS EC2 - For backend
  - AWS EC2 - For Blazegraph
  - AWS S3 - For frontend
  - Docker 

**Note:** Please use appropriate installation guides provided by the software providers based on your OS requirements

## API Documentation

***Note: accessible till 20/March/2024** Postman Api documentation can be access through this [LINK](https://documenter.getpostman.com/view/31802738/2sA2xb7vjD)


# Installation

### MySQL
We recommend using [mysqlworkbench](https://www.mysql.com/products/workbench/) to run the MySQL server locally

Once your MySQL server runs successfully, create an " across " database.
Make sure to update the settings.py with your MySQL configurations inside "DATABASES".

### Backend

Use the package manager pip or pip3 to run the backend. pip is usually part of python installation but in case you can't find pip command use this [link](https://pip.pypa.io/en/stable/)


Go to the folder Backend -> across and run the below commands
```bash
python3 -m pip install Django
```
```bash
python3 -m pip install -r requirements.txt
```
```bash
python3 manage.py makemigrations
```
```bash
python3 manage.py migrate
```
```bash
python3 manage.py runserver
```
**Note:** Please replace python3 with python incase python3 doesn't work on your system

_Hit the this URL on your browser to access the backend [LINK](http://127.0.0.1:8000/)_


### Frontend

Use the package manager npm to run the frontend. npm is part of NodeJS installation so you don't need to install it separately


Go to the folder Frontend -> across and run the below commands
```bash
npm install --force
```
```bash
npm run dev
```
_Hit this URL on your browser to access the webpage [LINK](http://localhost:5173/)_


### Blazegraph

Install the Blazegraph jar file from this [link](https://github.com/blazegraph/database/wiki/Quick_Start)

Go to the folder Blazegraph copy the installed jar and then run the following commands
```bash
java -server -Xmx4g -jar blazegraph.jar
```

_Hit this URL on your browser to access the blazegraph [LINK](http://localhost:9999/blazegraph/)_

***Note: accessible till 20/March/2024** In order head start with data you can upload some of the RDF files available at the [LINK](https://drive.google.com/drive/folders/1MjLmdYIQXa9I-gnUay1zUhH3CfGY0c_d?usp=sharing) to the blazegraph

## Deployment (Optional)
**Create and AWS account and run EC2 instances and S3 bucket before moving on the deployment**
**and also Install Docker on your machine [LINK](https://www.docker.com/)**


### Blazegraph
Create an image for linux based machine using the Dockerfile available in the Blazegraph folder
```bash
docker build -t blazegraph . --platform linux/amd64
```
Tag the image
```bash
docker tag across-server acrosswebwizards/blazegraph:latest 
```
Push the image to dockerhub
```bash
docker push acrosswebwizards/blazegraph:latest   
```
Pull the image to your running EC2 instance
```bash
docker pull acrosswebwizards/blazegraph:latest   
```

Run the image using the following command on your EC2
```bash
docker run -d -p 80:9999 blazegraph
```
**Note: Please update the above commands accordingly as per your docker hub account name, you can also use any other deployment platforms for deployment**

### Backend
Create an image for linux based machine using the Dockerfile available in the across folder
```bash
docker build -t across-server . --platform linux/amd64
```
Tag the image
```bash
docker tag across-server acrosswebwizards/across-server:latest 
```
Push the image to dockerhub
```bash
docker push acrosswebwizards/across-server:latest   
```
Pull the image to your running EC2 instance
```bash
docker pull acrosswebwizards/across-server:latest   
```

Run the image using the following command on your EC2
```bash
docker run -d -p 80:9999 across-server
```
**Note: Please update the above commands accordingly as per your docker hub account name, you can also use any other deployment platforms for deployment**

### Frontend
Configure AWS S3 bucket for static hosting

```bash
npm run build
```
Push to S3
```bash
aws s3 sync dist/ s3://[yourbucketname] 
```