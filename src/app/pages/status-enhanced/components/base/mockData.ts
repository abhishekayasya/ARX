const shippingDetails = {
  shipMode: "UPS",
  shipDate: "03/14/21", 
  shippingNumber: "SN12345",
  shippingCarrierUrl: "https://www.ups.com/us/en/global.page",
  address1: "123 N Main St",
  address2: "",
  city: "Chicago",
  state: "IL",
  zip: "60613"
}

const getMedicalItems = (drugCount, supplyCount)=> {
  const medicalItems = [];
  const itemObj = {
    referralId: "R12345",
    itemType: "",
    itemName: "",
    quantity: 1,
    price: "10.99",
    prescriber: "Doctor Robert",
    imgURL: "/images/IN1827/default_image_small.jpg",
    nextFillDate: "4/21/21",
    refillsRemaining: 2,
    viewId: "",
  }
  for(let i = 0; i < drugCount; i++){
    const itemNum = i + 1;
    const newItemObj = {...itemObj};
    newItemObj.itemName = "Drug " + itemNum;
    newItemObj.itemType = "Drug";
    medicalItems.push(newItemObj);
  }
  for(let i = 0; i < supplyCount; i++){
    const itemNum = i + 1;
    const newItemObj = {...itemObj};
    newItemObj.itemName = "Supply " + itemNum;
    newItemObj.itemType = "Supply";
    medicalItems.push(newItemObj);
  }
  return medicalItems
}

const mockData = [
  {
    profileId: "P12341",
    scriptMedId: "SM12341",
    name: "Mock Patient",
    hasOrderWithAttentionNeeded: false,
    noResponseFromSearch: true,
    noResponseFromArxStatus: true,
    noResponseFromGROD: true,
    orderId: "O12341",
    sortByDate: "03/16/21",
    progress: {
        progressBarStatus: "process",
        needsAdditionalInformationFromDoctor: false,
        needsAttention: false,
        needsAuthorization: false,
        needsInsuranceReview: false
    },
    orderType: "specialty",
    estimatedArrivalDate: "",
    medicalItems: [...getMedicalItems(1,0)],
    spDetail: {}
  }, {
    profileId: "P12342",
    scriptMedId: "SM12342",
    name: "Mock Patient",
    hasOrderWithAttentionNeeded: false,
    noResponseFromSearch: true,
    noResponseFromArxStatus: true,
    noResponseFromGROD: true,
    orderId: "O12342",
    sortByDate: "02/26/21",
    progress: {
        progressBarStatus: "pack",
        needsAdditionalInformationFromDoctor: false,
        needsAttention: false,
        needsAuthorization: false,
        needsInsuranceReview: true
    },
    orderType: "specialty",
    estimatedArrivalDate: "",
    medicalItems: [...getMedicalItems(1,1)],
    spDetail: {}
  }, {
    profileId: "P12343",
    scriptMedId: "SM12343",
    name: "Mock Patient",
    hasOrderWithAttentionNeeded: true,
    noResponseFromSearch: true,
    noResponseFromArxStatus: true,
    noResponseFromGROD: true,
    orderId: "O12343",
    sortByDate: "03/06/21",
    progress: {
        progressBarStatus: "process",
        needsAdditionalInformationFromDoctor: false,
        needsAttention: false,
        needsAuthorization: false,
        needsInsuranceReview: false
    },
    orderType: "specialty",
    estimatedArrivalDate: "",
    medicalItems: [...getMedicalItems(2,1)],
    spDetail: {}
  }, {
    profileId: "P12344",
    scriptMedId: "SM12344",
    name: "Mock Patient",
    hasOrderWithAttentionNeeded: true,
    noResponseFromSearch: true,
    noResponseFromArxStatus: true,
    noResponseFromGROD: true,
    orderId: "O12344",
    sortByDate: "03/12/21",
    progress: {
        progressBarStatus: "schedule-exception",
        needsAdditionalInformationFromDoctor: false,
        needsAttention: false,
        needsAuthorization: false,
        needsInsuranceReview: false
    },
    orderType: "specialty",
    estimatedArrivalDate: "",
    medicalItems: [...getMedicalItems(2,2)],
    spDetail: {...shippingDetails}
  }, {
    profileId: "P12345",
    scriptMedId: "SM12345",
    name: "Mock Patient",
    hasOrderWithAttentionNeeded: true,
    noResponseFromSearch: true,
    noResponseFromArxStatus: true,
    noResponseFromGROD: true,
    orderId: "O12345",
    sortByDate: "03/15/21",
    progress: {
        progressBarStatus: "ship",
        needsAdditionalInformationFromDoctor: false,
        needsAttention: false,
        needsAuthorization: false,
        needsInsuranceReview: false
    },
    orderType: "specialty",
    estimatedArrivalDate: "",
    medicalItems: [...getMedicalItems(2,3)],
    spDetail: {...shippingDetails}
  }, {
    profileId: "P12346",
    scriptMedId: "SM12346",
    name: "Mock Patient",
    hasOrderWithAttentionNeeded: true,
    noResponseFromSearch: true,
    noResponseFromArxStatus: true,
    noResponseFromGROD: true,
    orderId: "O12346",
    sortByDate: "03/15/21",
    progress: {
        progressBarStatus: "process-exception",
        needsAdditionalInformationFromDoctor: false,
        needsAttention: false,
        needsAuthorization: false,
        needsInsuranceReview: false
    },
    orderType: "specialty",
    estimatedArrivalDate: "",
    medicalItems: [...getMedicalItems(1,6)],
    spDetail: {}
  },
]


export default mockData;

