import pinyin from 'tiny-pinyin';
import type { AnyObject, CamelCaseType } from './interface';

export function camelCase(str: string, type: CamelCaseType = 1) {
  const words = str.match(/[a-zA-Z0-9]+/g);
  if (!words) {
    return '';
  }
  return words
    .map((word, index) => {
      if (index === 0) {
        return word.replace(
          word[0],
          type === 2 ? word[0].toUpperCase() : word[0].toLowerCase(),
        );
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

export function getPathName(path: string, maxLength = 5) {
  let pathName = path;
  const arr = pathName.split('/').filter((item) => item);
  if (arr.length > maxLength) {
    arr.splice(3, arr.length - maxLength);
  }
  pathName = arr.join('/');
  return pathName;
}

export function getTagName(name: string) {
  const tagName = (name.split('/').pop() || '').split('.').pop() || '';
  return pinyin.convertToPinyin(
    tagName.replace(/ +/g, '').replace(/[^\w^\s^\u4e00-\u9fa5]/gi, ''),
    '',
    true,
  );
}

export function openApiDataHandler(jsonData: AnyObject) {
  if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
    return jsonData;
  }

  try {
    const pathObj = jsonData?.paths || {};
    const schemaObj = jsonData?.components?.schemas || {};
    for (const key in pathObj) {
      const item: AnyObject = pathObj[key];
      const types = Object.keys(item);
      types.forEach((type) => {
        const parameters: AnyObject[] = item[type]?.parameters || [];
        const parametersRefIndex = parameters?.findIndex?.(
          (refItem) => refItem?.schema?.$ref,
        );
        if (parametersRefIndex > -1) {
          const parametersItem = parameters[parametersRefIndex];
          const refarr = parametersItem?.schema?.$ref?.split('/') || [];
          const ref: string = refarr[refarr.length - 1];
          if (!ref) {
            return;
          }
          const refObj: AnyObject = schemaObj?.[ref]?.properties || {};
          const paramsArr = Object.entries(refObj).reduce(
            (total: AnyObject[], cur) => {
              const [key, refItem] = cur;
              total.push({
                name: key,
                in: 'query',
                description: refItem?.description,
                required: refItem?.required,
                schema: { type: refItem?.type, format: refItem?.format },
              });
              return total;
            },
            [],
          );
          parameters.splice(parametersRefIndex, 1, ...paramsArr);
        }
      });
    }
  } catch (error: any) {
    console.log('openApiDataHandler error>>', error);
    throw new Error(error);
  }
  return jsonData;
}
