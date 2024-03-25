import { HotelFacilities } from "../../../../../types/Enums";

type Props = {
    selectedFacilities: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};


const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Facilities</h4>
            {Object.values(HotelFacilities).map((facility, index) => (
                <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" value={facility}
                        checked={selectedFacilities.includes(facility)} onChange={onChange}>
                    </input>
                    <span>{facility}</span>
                </label>
            ))}
        </div>
    )
};

export default FacilitiesFilter;
