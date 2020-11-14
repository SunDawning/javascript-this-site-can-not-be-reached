/*
Copyright (c) 2020, SunDawning <dpmeichen@gmail.com> https://github.com/SunDawning
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies,
either expressed or implied, of any organization or project.
 */
/*
get({
    url:"https://www.google.com",
    onLoad:function(text){
        document.write(text)},
    hostnamesUseProxy:[
        "google.com"
    ]
})
 */
function get(input){
    input=input||{}
    let url=input["url"]
    let onLoad=input["onLoad"]
    if(!url){return}
    if(!onLoad){return}
    if(typeof(url)!=="string"){return}
    if(typeof(onLoad)!=="function"){return}
    let hostnamesUseProxy=input["hostnamesUseProxy"]||[
        // 必须使用代理
        "www.google.com"
    ]
    let corsServers=input["corsServers"]||[
        "https://jsonp.afeld.me/?url=",
        "https://api.allorigins.win/raw?url=",
        "https://salty-earth-46109.herokuapp.com/",
        "https://eerovil-cors-proxy.herokuapp.com/",
        "https://lazyguy-nhl-proxy.herokuapp.com/",
        "https://cors-anywhere.herokuapp.com/"
    ]
    function convertStandardUrl(url,hostnames){
        function isUrlExist(url,urls){
            return (urls["indexOf"](new URL(url)["hostname"])!==-1)
        }
        function random(array){
            return array[Math["floor"](array["length"]*Math["random"]())]
        }
        hostnames=hostnames||[]
        var output=url
        if(isUrlExist(url,hostnames["concat"](hostnamesUseProxy))){
            output=random(corsServers)+url
            console["log"](output)
        }
        return output
    }
    function getByStandardUrl(method,url,onLoad){
        method(convertStandardUrl(url,[
            new URL(url)["hostname"]
        ]),onLoad,true)
    }
    if(typeof(XMLHttpRequest)==="function"){
        function xmlGet(url,onLoad,fromRetry){
            var request=new XMLHttpRequest()
            if(!fromRetry){
                request["addEventListener"]("error",function(event){
                    getByStandardUrl(xmlGet,url,onLoad)
                })
                url=convertStandardUrl(url,[
                    // 仅浏览器里需要使用代理
                    "www.baidu.com",
                    "fund.eastmoney.com"
                ])
            }
            request["onreadystatechange"]=function(event){
                if(request["readyState"]===4&&request["status"]===200){
                    onLoad(request["responseText"])}}
            request["open"]("GET",url,true)
            request["send"](null)
        }
        return xmlGet(url,onLoad)
    }
    if(typeof(Deno)==="object"){
        function denoGet(url,onLoad,fromRetry){
            let originUrl=url
            if(!fromRetry){
                url=convertStandardUrl(url)
            }
            fetch(url,{
                headers:{"Origin":"origin"}
            })["then"](function(response){
                return response["text"]()})["catch"](function(error){
                    if(!fromRetry){
                        getByStandardUrl(denoGet,originUrl,onLoad)
                    }else{
                        console["log"](error)
                    }
                })["then"](function(text){
                    onLoad(text)})
        }
        return denoGet(url,onLoad)
    }
    if(true){
        function nodeGet(url,onLoad,fromRetry){
            function protocol(url){
                return new URL(url)["protocol"]["replace"](":","")
            }
            let originUrl=url
            if(!fromRetry){
                url=convertStandardUrl(url)
            }
            require(protocol(url))["get"](url,{
                headers:{"Origin":"origin"}
            },function(response){
                response["on"]("data",function(data){
                    onLoad(data["toString"]())
                })
            })["on"]("error",function(error){
                if(!fromRetry){
                    getByStandardUrl(nodeGet,originUrl,onLoad)
                }else{
                    console["log"](error)
                }
            })
        }
        return nodeGet(url,onLoad)
    }
}
