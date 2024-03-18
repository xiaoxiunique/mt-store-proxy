import axios from "axios";
import JSZip from "jszip";
import FileSaver from "file-saver";

export async function batchDownload(
  title: string,
  urls: {
    title: string;
    url: {
      name: string;
      url: string;
    }
  }[]
) {
  const zip = new JSZip();
  const promises = urls.map(url =>
    axios.get(url.url.url, { responseType: "blob" })
  );
  const responses = await Promise.all(promises);
  responses.forEach((response, index) => {
    const { data } = response;
    const filename = urls[index].title;
    zip.file(filename, data);
  });
  zip.generateAsync({ type: "blob" }).then(content => {
    FileSaver.saveAs(content, `${title}.zip`);
  });
}
