import { appConfig } from "../app/appConfig";
import { localize } from "../app";
import { ContentEntity, ContentEntityType } from "./ContentEntity";

/**
 * Communication with API.
 */
class ApiStore {
    private static instance: ApiStore;

    private constructor() { }

    static getInstance(): ApiStore {
        if (!ApiStore.instance) {
            ApiStore.instance = new ApiStore();
        }
        return ApiStore.instance;
    }

    public async getContent(args: GetContentArgs): Promise<ContentResponse> {
        // Type
        const contentType: string = args.type;

        // Query string
        const queryArray: any[] = [];
        
        queryArray.push(
            args.page !== undefined ? ['page', args.page] : ['page', 0]
        );
        queryArray.push(
            args.numberOfItems !== undefined ? ['numberOfItems', args.numberOfItems] : ['numberOfItems', 10]
        );
        if (args.updatedFromDate !== undefined) {
            queryArray.push(['updatedFromDate', args.updatedFromDate]);
        }

        const queryString = queryArray.map((value:any) => `${value[0]}=${value[1]}`).join('&');

        // Language
        const language = localize.getLanguage();

        // URL
        const url = `${appConfig.apiUrl}/list-content/${language}/${contentType}?${queryString}`;

        // Get API response
        let response: ContentResponse = {total:0, data:[]};

        try {
            let rawResponse: Response = await fetch(url, {
                // Fetch API: https://mzl.la/2CuHdZa
                method: 'GET',
            });

            // Response API: https://mzl.la/2ARLxBl
            const rawResponseJson = await rawResponse.json();

            if (rawResponseJson) {
                response.total = rawResponseJson.total;
                response.data = rawResponseJson.data.map((rawContent:any): ContentEntity => {
                    return {
                        id: parseInt(rawContent.id),
                        body: rawContent.body,
                        type: rawContent.type,
                        langcode: rawContent.langcode,
                        title: rawContent.title,
                        category: parseInt(rawContent.category),
                        predefinedTags: rawContent.predefined_tags.map((value:any) => parseInt(value)),
                        keywords: rawContent.keywords.map((value:any) => parseInt(value)),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        coverImageUrl: rawContent.cover_image?.url,
                        coverImageAlt: rawContent.cover_image?.alt,
                    };
                });
            }
        } catch (rejectError) { }

        return response;
    }
}

interface ContentResponse {
    total: number;
    data: ContentEntity[];
}

interface GetContentArgs {
    type: ContentEntityType;

    /**
     * Defaults to 10
     */
    numberOfItems?: number;

    /**
     * Defaults to 0
     */
    page?: number;

    /**
     * UNIX timestamp
     */
    updatedFromDate?: number;
}

export const apiStore = ApiStore.getInstance();