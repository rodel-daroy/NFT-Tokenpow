<h1>TXT</h1>

<h2>Where to find TXT?</h2>
<ol>
  <li>
    Google cloud admin panel
  </li>
  <li>
    Compute Engine -> VM Instances
  </li>
</ol>

<h2>Connect to TXT</h2>
Just click on SSH on admin panel and terminal will comes up.

<h2>How to reinstall or clean install of TXT on GCloud</h2>
<h4>Follow these steps</h4>
<ol>
  <li>Create VM instance on Compute engine</li>
  <li>
    In terminal write following commands in THIS order:
  </li>

  <li>sudo apt update</li>
  <li>sudo apt install apt-transport-https ca-certificates curl software-properties-common</li>
  <li>sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common</li>
  <li>curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -</li>
  <li>sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"</li>
  <li>sudo apt update</li>
  <li>apt-cache policy docker-ce</li>
  <li>sudo apt install docker-ce</li>
  <li>sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname-m)" -o /usr/local/bin/docker-compose</li>
  <li>sudo chmod +x /usr/local/bin/docker-compose</li>
  <li>mkdir txt</li>
  <li>cd txt</li>
  <li>nano docker-compose.yml</li>
  <li>TO YML FILE PUT THIS, TOKEN must be the same which we are sending FROM APP</li>
  <li>
  GNU nano 3.2                                           docker-compose.yml                                                      
version: '3.5'
services:
  txt:
    image: planaria/txt:0.0.5
    stdin_open: true
    volumes:
      - ./mnt:/root/mnt
    environment:
      - NAME=gobitfundme-dev.txt
      - DESCRIPTION=GoBitFundMe transactions of whole application
      - MINER_URL=https://merchantapi.taal.com
      - TOKEN=eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkdvQml0RnVuZE1lIiwiaWF0IjoxNTE2MjM5MDIyfQ
    ports:
      - "3013:3013"
    networks:
      - txt
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
networks:
  txt:
    name: txt
</li>
<li>SAVE FILE</li>
<li>sudo docker-compose up -d</li>
<li>Can close the terminal</li>
<li>Find VPC Network by searching</li>
<li>Click on FIREWALL</li>
<li>Add RULE</li>
<li>Target -> http-server,https-server</li>
<li>IP Ranges -> 0.0.0.0/0</li>
<li>TCP -> 3013</li>
</ol>
