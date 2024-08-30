const pipeline = [
    {
        $match: {
            page_slug: { $exists: true, $ne: null } // Filter documents with a non-null page_slug
        }
    },
    {
        $addFields: {
            page_slugs: {
                $arrayElemAt: [
                    { $split: ["$page_slug", "/"] },
                    0
                ]
            }
        }
    },
    {
        $group: {
            _id: "$page_slugs" // Group by page_slugs to get unique values
        }
    },
    {
        $project: {
            _id: 0,
            page_slugs: "$_id" // Rename _id to page_slugs
        }
    }
];

module.exports = pipeline