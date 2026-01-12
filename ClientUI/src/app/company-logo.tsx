import type { ICompany } from "./problems-list";

export const CompanyLogos = ({ companies, maxDisplay = 5 }: { companies: ICompany[], maxDisplay?: number }) => {
    const displayCount = Math.min(companies.length, maxDisplay);
    const remainingCount = companies.length - maxDisplay;

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2">
                {companies.slice(0, displayCount).map((company, index) => (
                    <div
                        key={index}
                        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                        title={company.name}
                    >
                        {company.image_url ? (
                            <img
                                src={company.image_url}
                                alt={company.name}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <span>{company.name.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div
                        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-gray-600 font-semibold text-xs shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                        title={`+${remainingCount} more companies`}
                    >
                        +{remainingCount}
                    </div>
                )}
            </div>
        </div>
    );
};
