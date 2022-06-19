import Image from "next/image";

interface Props {
  title: string;
  description: string;
  icon: any;
}

const Card: React.FC<Props> = ({ title, description, icon }) => {
  return (
    <div className="p-[30px] flex flex-col text-center bg-[#222] rounded">
      <Image src={icon} height={64} width={64} alt={title + " icon"} />
      <h3 className="text-lg font-bold mt-[20px]">{title}</h3>
      <p className="text-base max-w-[300px] mx-auto">{description}</p>
    </div>
  );
};

export default Card;
