export default {
  name: "caaddress",
  title: "Collectionaddress",
  type: "document",
  fields: [
    {
      title: "addy",
      name: "addy",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
};
