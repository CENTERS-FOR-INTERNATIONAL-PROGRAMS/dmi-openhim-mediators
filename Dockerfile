FROM node:alpine
# Avoid tz data prompts

WORKDIR /app
COPY . /app
RUN ls -a
#############################
RUN apk add curl
RUN apk add --no-cache gnupg
RUN set -ex && apk --no-cache add sudo
#Download the desired package(s)
RUN curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.10.1.1-1_amd64.apk && \
  curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.10.1.1-1_amd64.apk && \
  curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.10.1.1-1_amd64.sig && \
  curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.10.1.1-1_amd64.sig && \
  curl https://packages.microsoft.com/keys/microsoft.asc  | gpg --import - && \
  gpg --verify msodbcsql17_17.10.1.1-1_amd64.sig msodbcsql17_17.10.1.1-1_amd64.apk && \
  gpg --verify mssql-tools_17.10.1.1-1_amd64.sig mssql-tools_17.10.1.1-1_amd64.apk && \
  sudo apk add --allow-untrusted msodbcsql17_17.10.1.1-1_amd64.apk && \
  sudo apk add --allow-untrusted mssql-tools_17.10.1.1-1_amd64.apk && \
  sudo apk add py3-pip && \
  apk add python3 python3-dev g++ unixodbc-dev && \
  python3 -m ensurepip && \
  pip3 install --user pyodbc

# COPY requirements.txt requirements.txt
# RUN pip3 install -r requirements.txt
RUN ls
RUN npm install

CMD npm start
EXPOSE 3001


#ENTRYPOINT [ "python3" ]
#CMD ["manage.py", "runserver", "0.0.0.0:5000"]
#CMD ["manage.py", "runscript", "checkout_consumer"]

