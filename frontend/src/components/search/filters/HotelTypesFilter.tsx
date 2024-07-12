import { HotelTypes } from "../../../../../types/Enums";

type Props = {
    selectedHotelTypes: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h4 className="text-sm font-semibold">Hotel Type</h4>
            <div className="flex flex-wrap text-sm gap-2 md:gap-4">
                {Object.values(HotelTypes).map((hotelType, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" value={hotelType}
                            checked={selectedHotelTypes.includes(hotelType)} onChange={onChange} />
                        <span className="px-2">{hotelType}</span>
                    </label>
                ))}
            </div>
        </div>
    )
};

export default HotelTypesFilter;
