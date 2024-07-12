type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
}

const PriceFilter = ({ selectedPrice, onChange }: Props) => {

    const prices = [1000, 2500, 5000, 15000, 30000];

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h4 className="text-sm font-semibold">Max Price</h4>
            <div className="flex flex-wrap text-sm gap-2 md:gap-4">
                {prices.map((price) => (
                    <label key={price} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value={price}
                            checked={selectedPrice === price}
                            onChange={() => onChange(price)}
                            className="m-2"
                        />
                        <span>{price}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default PriceFilter;
