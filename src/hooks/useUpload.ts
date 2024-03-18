import { ElMessage, UploadProps } from "element-plus";

export const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (
    rawFile.type !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    ElMessage.error("请上传 xlsx 文件");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小不能超过 2MB");
    return false;
  }
  return true;
};
