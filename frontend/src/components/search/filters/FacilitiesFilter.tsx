import { HotelFacilities } from "../../../../../types/Enums";

type Props = {
    selectedFacilities: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h4 className="text-sm font-semibold mr-4">Facilities</h4>
            <div className="flex flex-wrap text-sm gap-2 md:gap-4">
                {Object.values(HotelFacilities).map((facility, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" value={facility}
                            checked={selectedFacilities.includes(facility)} onChange={onChange} />
                        <span className="px-2">{facility}</span>
                    </label>
                ))}
            </div>
        </div>
    )
};

export default FacilitiesFilter;
