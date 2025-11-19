import type { GetServerSideProps,NextPage } from "next";
import { getLinkByCode, incrementClick, isValidCode } from "@/lib/queries";

type Props = {
  notFound?: boolean;
}

const RedirectPage: NextPage<Props> = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (data) => {
  const code = data.params?.code;
  if (typeof code !== "string" || !isValidCode(code)) {
    return {
      notFound: true,
    };
  }
  const link = await getLinkByCode(code);
  if (!link) {
    return {
      notFound: true,
    };
  }
  await incrementClick(code);
  return {
    redirect: {
      destination: link.url,
      permanent: false, 
    },
  };
};

export default RedirectPage;