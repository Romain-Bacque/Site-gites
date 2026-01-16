// hook import
import { useEffect, useState } from "react";
// component import
import Chip from "@mui/material/Chip";
// styled component import
import { ListItem, StyledPaper } from "./style";
// other import
import { Place, TagsListProps } from "./types";

// Component
const TagsList: React.FC<TagsListProps> = ({ onTagDelete, list }) => {
  const [chipData, setChipData] = useState<Place[]>([]);

  const handleDelete = (locationId: string) => {
    setChipData((chips) => chips.filter((chip) => chip.id !== locationId));
    onTagDelete(locationId);
  };

  useEffect(() => {
    setChipData(list);
  }, [list]);

  return (
    <StyledPaper component="ul">
      {chipData?.length > 0
        ? chipData.map((place) => (
            <ListItem key={place.id}>
              <Chip
                sx={{ fontSize: "0.95rem" }}
                label={place.address}
                onDelete={() => handleDelete(place.id)}
              />
            </ListItem>
          ))
        : null}
    </StyledPaper>
  );
};

export default TagsList;
