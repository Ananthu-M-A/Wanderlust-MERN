
type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
}

const PriceFilter = ({ selectedPrice, onChange }: Props) => {

    return (
        <div>
            <h4 className="text-md font-semibold mb-2">
                Max Price
            </h4>
            <select value={selectedPrice} className="p-2 border rounded-md w-full"
                onChange={(event) => onChange(event.target.value ? parseInt(event.target.value) : undefined)}>
                <option value="">Select Max Price</option>
                {[1000,2500,5000,15000,30000].map((price, index) => (
                    <option key={index} value={price}>{price}</option>
                ))}
            </select>
        </div>
    )
}

export default PriceFilter
