//interfaces
export interface Place {
  id: string;
  address: string;
}
export interface TagsListProps {
  list: Place[];
  onTagDelete: (arg: string) => void;
}
