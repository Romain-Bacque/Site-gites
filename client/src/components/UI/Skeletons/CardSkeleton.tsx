import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardSkeleton: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Skeleton borderRadius={3} height={200} />
      <Skeleton
        style={{
          marginTop: "1rem",
        }}
        height={50}
        count={1}
      />
    </div>
  );
};

export default CardSkeleton;
