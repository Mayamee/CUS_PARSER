const fs = require("fs");
const { sortJSON } = require("./sort");
const PATTERN = {
  APP: "(?=(Сведения|Ошибка|Предупреждение))(.+?)(?=(Сведения|Ошибка|Предупреждение))",
  SECURITY: "(?=(Аудит успеха))(.+?)(?=(Аудит успеха))",
  SYSTEM:
    "(?=(Сведения|Ошибка|Предупреждение))(.+?)(?=(Сведения|Ошибка|Предупреждение))",
};

const parse = (textFromFile, regexPattern) =>
  textFromFile
    .replace(/Ошибка[ :]/g, "Error ")
    .replace(/Сведения[ :]/g, "Svedenia ")
    .replace(/Предупреждение[ :]/g, "Preduprejdenie ")
    .replace(/(\n|\r)/g, "")
    .match(new RegExp(regexPattern, "g"))
    .map((e) => {
      const tmpArr = e.trim().split("\t");
      return {
        Уровень: tmpArr[0],
        "Дата и время": tmpArr[1],
        Источник: tmpArr[2],
        "Код события": +tmpArr[3],
        "Категория задачи": tmpArr[4],
        Описание: tmpArr[5],
      };
    });

const parseSEC = (textFromFile, regexPattern) =>
  textFromFile
    .replace(/(\n|\r)/g, "")
    .match(new RegExp(regexPattern, "g"))
    .map((e) => {
      const tmpArr = e.trim().split("\t");
      return {
        "Ключевые слова": tmpArr[0],
        "Дата и время": tmpArr[1],
        Источник: tmpArr[2],
        "Код события": +tmpArr[3],
        "Категория задачи": tmpArr[4],
        Описание: tmpArr.slice(4).reduce((prev, cur) => (prev += cur)),
      };
    });

const targetFolders = fs
  .readdirSync("./src", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((e) => e.name);
// вычисляем целевые папки

targetFolders.forEach((e) => {
  fs.mkdirSync(`./dist/${e}`, { recursive: true });
  try {
    const dataApp = fs.readFileSync(`./src/${e}/app.txt`, "utf-8") + "Сведения";
    const toJSONApp = JSON.stringify(
      sortJSON(parse(dataApp, PATTERN.APP)),
      null,
      2
    );
    fs.writeFileSync(`./dist/${e}/app.json`, toJSONApp);
  } catch (error) {
    console.error(error);
  }
  try {
    const dataSec =
      fs.readFileSync(`./src/${e}/security.txt`, "utf-8") + "Аудит успеха";
    const toJSONSec = JSON.stringify(
      sortJSON(parseSEC(dataSec, PATTERN.SECURITY)),
      null,
      2
    );
    fs.writeFileSync(`./dist/${e}/security.json`, toJSONSec);
  } catch (error) {
    console.error(error);
  }
  try {
    const dataSys =
      fs.readFileSync(`./src/${e}/system.txt`, "utf-8") + "Сведения";
    const toJSONSys = JSON.stringify(
      sortJSON(parse(dataSys, PATTERN.SYSTEM)),
      null,
      2
    );
    fs.writeFileSync(`./dist/${e}/system.json`, toJSONSys);
  } catch (error) {
    console.error(error);
  }
});
// создаем папки в каталоге dist и наполняем содержимым
