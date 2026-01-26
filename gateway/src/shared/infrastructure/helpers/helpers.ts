export const appendParams = (searchParams: URLSearchParams
    ,key: string,
    value:any
) => {
    if (value == null || value == undefined ) return;

    if (Array.isArray(value)) {
        value.forEach((item,index)=>{
            appendParams(searchParams,`${key}[${index}]`,item);
        });
        return;
    }
    if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey,subValue]) => {
            appendParams(searchParams,`${key}[${subKey}]`,subValue);
        })
        return;
    }
    searchParams.append(key, value.toString());
}