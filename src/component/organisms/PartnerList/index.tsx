"use client";

import type { PartnerListResponse } from "@model/partner";
import PartnerItem from "@organisms/PartnerItem";


export default function PartnerList(props: PartnerListResponse) {
  console.log(props);


  return (
    <div className="w-full justify-start items-center gap-2 grid grid-cols-1 md:grid-cols-2 ">
      {props.items && props.items.map((partner) => (
        <PartnerItem key={partner.id} partner={partner} />
      ))}
    </div>
  );
}
