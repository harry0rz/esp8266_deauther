# ESP8266 Deauther

<img src='https://deauther.com/img/logo.png' alt='Deauther Logo' width='200' />

# for dev
改装用

## structure
esp8266_deauther ------- 硬件编译  
    data --------------- web打包gzip 二进制文件  // gzip转义二进制用 https://www.mischianti.org/2020/10/26/web-server-with-esp8266-and-esp32-byte-array-gzipped-pages-and-spiffs-2/   
    srt ----------------- 硬件源  
    * ------------------- 各个文件  

util -------------------- 编译用到的文件  
web_interface ----------- 网页源码  

## 编译网页  
```
pip install anglerfish
python webConverter.py
```  

### 参考途径  
root： https://github.com/spacehuhntech/esp8266_deauther  
wifista： https://github.com/martin-ger/esp_wifi_repeater  