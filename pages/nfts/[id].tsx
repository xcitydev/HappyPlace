import { GetServerSideProps } from "next";
import React from "react";
import { sanityClient } from "../../sanity";
import { Collection } from "../../typings";

interface Props {
  collections: Collection;
}
const NftDropPage = ({ collections }: Props) => {
  return (
    <div>
      <p>{collections.title}</p>
    </div>
  );
};

export default NftDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
  ...,
  description,
  creator->{
  ...,
}
            
            
            
  }`;

  const collections = await sanityClient.fetch(query, {
    id: params?.id,
  });
  console.log(collections);
  if (!collections) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collections,
    },
  };
};
