import axios from "axios";
import { File } from "expo-file-system";
export async function  predict(fileImage:string, apiKey:string, baseUrl:string){
try {
    
        const file = new File(fileImage);
        const base64 = file.base64Sync();

        const form = new FormData();
        form.append("file", base64);
        form.append("fileName", "hh");

        const options = {
          method: "POST",
          url: "https://upload.imagekit.io/api/v1/files/upload",
          headers: {
            "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
            Accept: "application/json",
            Authorization: `Basic ${apiKey}`,
          },
          data: form,
        };

        const { data } = await axios.request(options).catch(e=>console.log(e));
        const prediction = await axios.post(`${baseUrl}/predict`, {
            url:data.url
        })
        return prediction.data
        
} catch (error) {
  console.log(error)
    
}
}