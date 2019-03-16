var url = location.hash;
if(url.charAt(0) === '#'){  url = url.substr(1); }
location.href = url;