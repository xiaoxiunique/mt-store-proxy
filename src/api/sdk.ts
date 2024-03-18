import qs from "qs";
import _ from "lodash";

export default class SDK {
  constructor(private readonly cookie: string) {}

  public async poiList() {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://yiyao.meituan.com/api/poi/poiList?yodaReady=h5&csecplatform=4&csecversion=2.4.0",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Length": "0",
        Cookie: this.cookie,
        Origin: "https://yiyao.meituan.com",
        Pragma: "no-cache",
        Referer: "https://yiyao.meituan.com/main/frame",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"'
      }
    };

    const r = await window["ipcRenderer"].invoke("fetch", config);
    return r;
  }

  public async tagList(poiId) {
    const data = qs.stringify({
      wmPoiId: poiId,
      needSmartSort: "true"
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://yiyao.meituan.com/reuse/health/product/retail/r/tagList?yodaReady=h5&csecplatform=4&csecversion=2.4.0",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: this.cookie,
        "M-APPKEY": "fe_com.sankuai.yiyao.eproduct.manager",
        "M-TRACEID": "-1972624701778447426",
        Origin: "https://yiyao.meituan.com",
        Pragma: "no-cache",
        Referer:
          "https://yiyao.meituan.com/page/product/list/single?wmPoiId=18662725&region_id=1000320300&region_version=1690790101",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"'
      },
      data: data
    };

    const r = await window["ipcRenderer"].invoke("fetch", config);
    console.log(r.data);
    return r.data;
  }

  public async deletePoi(poiId: string, tagIds: string[]) {
    for (const tagId of tagIds) {
      const data = qs.stringify({
        wmPoiId: poiId,
        type: "1",
        tagId: tagId
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://yiyao.meituan.com/reuse/health/product/retail/w/tag/delete?yodaReady=h5&csecplatform=4&csecversion=2.4.0",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: this.cookie,
          "M-APPKEY": "fe_com.sankuai.yiyao.eproduct.manager",
          "M-TRACEID": "7301289114727607522",
          Origin: "https://yiyao.meituan.com",
          Pragma: "no-cache",
          Referer:
            "https://yiyao.meituan.com/page/product/list/single?wmPoiId=18662725&region_id=1000320300&region_version=1690790101",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "sec-ch-ua":
            '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"'
        },
        data: data
      };

      await window["ipcRenderer"].invoke("fetch", config);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  public async saveTag(poiId: string, tagInfo: any) {
    const data = qs.stringify({
      wmPoiId: poiId,
      tagInfo: JSON.stringify(tagInfo)
    });

    const config = {
      method: "POST",
      url: "https://yiyao.meituan.com/reuse/health/product/food/w/saveWmProductTag?yodaReady=h5&csecplatform=4&csecversion=2.4.0",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Content-Type": "application/x-www-form-urlencoded",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "M-TRACEID": "3978694701379436845",
        "sec-ch-ua-mobile": "?0",
        "M-APPKEY": "fe_com.sankuai.yiyao.eproduct.manager",
        "sec-ch-ua-platform": '"macOS"',
        Origin: "https://yiyao.meituan.com",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        Referer: `https://yiyao.meituan.com/page/product/list/single?wmPoiId=${poiId}&region_id=1000320300&region_version=1690790101`,
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        Cookie: this.cookie
      },
      data: data
    };

    const r = await window["ipcRenderer"].invoke("fetch", config);
    return r.data;
  }

  public async saveProduct(poiId, product, upcproduct, tagList) {
    if (!upcproduct?.pic || !product.standardCategorys) {
      return;
    }
    let { imgContent } = product;
    if (imgContent === undefined) {
      imgContent = {
        map: "",
        imgs: [],
        taxBearingType: "",
        quaImgs: [],
        quaApprovalDate: "",
        quaEffectiveDate: "",
        expirationDate: "",
        skus: []
      };
    }
    const mergedProduct = _.merge({}, upcproduct, product);
    console.log("mergedProduct", mergedProduct);

    let obj = {
      name: product.name,
      description: product.description,
      picContent: upcproduct.pic,
      spPicContentSwitch: "1",
      shippingTimeX: "-",
      skus: JSON.stringify( // merge upc.skus res and product.skus
        product.skus.map((value, index) => {
          return {
            id: "",
            spec: value.spec,
            price: +value.price,
            unit: value.unit,
            stock: +value.stock,
            weight: 10,
            weightUnit: _.get(upcproduct, `skus[${index}].weightUnit`, value.weightUnit),
            ladderPrice: value?.ladderBox.boxPrice,
            ladderNum: value?.ladderBox.boxNum,
            upcCode: value.upccode,
            upc: value.upccode,
            skuCode: "",
            minOrderCount: +value.min_order_count,
            skuAttrs: [],
            oriPrice: +value.origin_price,
            commonProperty: null,
            skipUpcImg: value.picture
          };
        })
      ),
      attrList:'[]',
      picture: upcproduct.pic, // unknown
      labels: "[]",
      isSp: 0,
      spId: 0,
      categoryId: product.standardCategorys[product.standardCategorys.length - 1].id,
      categoryPath: product.standardCategorys.map(item => item.id).join(','),
      tagList: tagList || '[{"tagId":790340656,"tagName":"组合装19.9起"}]',
      limitSale:
        '{"limitSale":false,"begin":"","end":"","type":1,"frequency":1,"count":0}',
      categoryAttrMap: JSON.stringify(upcproduct?.categoryAttrMap ||{}),
      spuSaleAttrMap: JSON.stringify({}),
      upcImage: "",
      sellStatus: product.sellStatus,
      marketingPicture: "",
      wmPoiId: poiId,
      skipAudit: "false",
      validType: "0",
      missingRequiredInfo: "false",
      auditStatus: "0",
      useSuggestCategory: "false",
      auditScene: "0",
      saveType: "1",
      auditSource: "1",
      spVideoStatus: "0",
      checkActivitySkuModify: "true",
      hsCodeId: "",
      quaApprovalDate: upcproduct.quaApprovalDate,
      quaEffectiveDate: upcproduct.quaEffectiveDate,
      expirationDate: '',
    };
    const data = qs.stringify(obj);
    console.log("--------- req data -----------", obj);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://yiyao.meituan.com/reuse/health/product/retail/w/uniSave?yodaReady=h5&csecplatform=4&csecversion=2.4.0",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: this.cookie,
        "M-APPKEY": "fe_com.sankuai.yiyao.eproduct.manager",
        "M-TRACEID": "-1644532022233145205",
        Origin: "https://yiyao.meituan.com",
        Pragma: "no-cache",
        Referer:
          "https://yiyao.meituan.com/page/product/detail/product/new?queryFrom=0&wmPoiId=18662725&from=single&region_id=1000320300&region_version=1690790101&region_id=1000320300",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"'
      },
      data: data
    };

    const r = await window["ipcRenderer"].invoke("fetch", config);
    console.log(r);
    return r.data;
  }

  public async getUpcInfo(poiId, upccode) {
    const data = qs.stringify({
      ean: upccode,
      wmPoiId: poiId
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://yiyao.meituan.com/reuse/health/product/retail/r/getSpDetailByEanWithStatus?yodaReady=h5&csecplatform=4&csecversion=2.4.0",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie:
          this.cookie,
        "M-APPKEY": "fe_com.sankuai.yiyao.eproduct.manager",
        "M-TRACEID": "216052122260856609",
        Origin: "https://yiyao.meituan.com",
        Pragma: "no-cache",
        Referer:
          "https://yiyao.meituan.com/page/product/detail/product/new?queryFrom=0&wmPoiId=18662725&from=single&region_id=1000320300&region_version=1690790101&region_id=1000320300&region_version=1690790101",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"'
      },
      data: data
    };

    const r = await window["ipcRenderer"].invoke("fetch", config);
    return r.data;
  }
}
