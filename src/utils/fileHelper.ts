const fs = window.require("fs").promises; // 重点，需要使用window下面的方法才能获取到node的环境
const path = window.require("path");

const fileHelper = {
  readFile: (filePath: string) => {
    return fs.readFile(filePath, { encoding: "utf8" });
  },
  writeFile: async (filePath: string, content: string) => {
    const dirname = path.dirname(filePath);
    console.log("dirname", dirname);
    const isExist = await fileIsExist(dirname);
    try {
      if (!isExist) {
        await fs.mkdir(dirname, { recursive: true });
      }
    } catch (error) {
      console.log(error);
    }
    return fs.writeFile(filePath, content, { encoding: "utf8" });
  },
  renameFile: (filePath: string, newFilePath: string) => {
    return fs.rename(filePath, newFilePath);
  },
  deleteFile: (filePath: string) => {
    return fs.unlink(filePath);
  },
};

async function fileIsExist(dirname: string) {
  let isExist = false;
  try {
    await fs.access(dirname, fs.constants.F_OK);
    isExist = true;
  } catch (error) {
    isExist = false;
  }
  return isExist;
}

export default fileHelper;
