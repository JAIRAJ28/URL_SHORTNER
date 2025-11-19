import React from 'react'
import { useMemo, useState } from "react";
import type { linktable } from "@/types/link";

type LinkTableProps = {
  links: linktable[];
  loading: boolean;
  error: string | null;
  onDeleted: (code: string) => void;
};
const LinkTable = () => {
  const [search, setSearch] = useState("");
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  
  return (
    <div>
      
    </div>
  )
}

export default LinkTable
