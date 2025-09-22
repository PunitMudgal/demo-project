import { Response } from 'express';

const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => _${letter.toLowerCase()});
};

const convertToSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'object' && typeof (obj as any).toISOString === 'function') {
    try {
      return (obj as any).toISOString();
    } catch {
    }
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertToSnakeCase(item));
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = toSnakeCase(key);
      converted[snakeKey] = convertToSnakeCase(value);
    }
    return converted;
  }
  
  return obj;
};

export interface PaginateResponseInput<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
}

export interface PaginateResponse<T> {
  total_pages: number;
  number_of_rows: number;
  current_page: number;
  limit: number;
  total_records: number;
  paginated_results: T[];
  meta?: Record<string, any>;
}


export interface PaginateQueryOptions {
  sortingKeys?: string[];
  filterKeys?: string[];
  defaultSortingKey?: string;
}

export interface PaginateQueryResult {
  page: number;
  limit: number;
  skip: number;
  sortingDirection: 'asc' | 'desc'; 
  sortingKey: string;
  filterType?: string;
  filterValue?: any[];
}


export const handleResponseV2 = <T>(
  {
    data,
    message,
    statusCode,
    status = statusCode >= 200 && statusCode < 400, 
  }: { data?: T; message: string; statusCode: number; status?: boolean },
  res: Response
) => {
  return res.status(statusCode).json({
    data: data,
    message,
    status_code: statusCode,
    status,
  });
};


export const handleResponse1 = <T>(
  {
    data,
    message,
    statusCode,
  }: { data?: T; message: string; statusCode: number },
  res: Response
) => {
  return res.status(statusCode).json({
    data,
    message,
  });
};

export const handleResponse = <T>(
  {
    data,
    message,
    statusCode,
    status = statusCode >= 200 && statusCode < 400, 
  }: { data?: T; message: string; statusCode: number; status?: boolean },
  res: Response
) => {
  return res.status(statusCode).json({
    data: data ? convertToSnakeCase(data) : data,
    message,
    status_code: statusCode,
    status,
  });
};

export const OkResponseV2 = <T>(
  {
    data,
    message,
    statusCode = 200,
  }: { data?: T; message: string; statusCode?: number },
  res: Response
) => handleResponseV2({ data, message, statusCode }, res);


export const OkResponse = <T>(
  {
    data,
    message,
    statusCode = 200,
  }: { data?: T; message: string; statusCode?: number },
  res: Response
) => handleResponse({ data, message, statusCode }, res);

export const CreatedResponse = <T>(
  { data, message }: { data?: T; message: string },
  res: Response
) => {
  return handleResponse({ data, message, statusCode: 201 }, res);
};

export const ErrorResponse = (
  { message }: { message: string },
  res: Response
) => {
  console.log('ErrorResponse', message);
  return handleResponse({ message, statusCode: 500 }, res);
};

export const NotFoundResponse = (
  { message }: { message: string },
  res: Response
) => handleResponse({ message, statusCode: 404 }, res);

export const BadRequestResponse = (
  { message }: { message: string },
  res: Response
) => handleResponse({ message, statusCode: 400 }, res);

export const UnauthorizedResponse = (
  { message }: { message: string },
  res: Response
) => handleResponse({ message, statusCode: 401 }, res);

export const ForbiddenResponse = (
  { message }: { message: string },
  res: Response
) => handleResponse({ message, statusCode: 403 }, res);

export const UnprocessableEntityResponse = <T>(
  { message, data }: { message: string; data?: T },
  res: Response
) => handleResponse({ message, statusCode: 422, data }, res);

export const InternalServerErrorResponse = (
  { message }: { message: string },
  res: Response
) => handleResponse({ message, statusCode: 500 }, res);

export const ConflictResponse = (
  { message }: { message: string },
  res: Response
) => handleResponse({ message, statusCode: 409 }, res);



export const paginationResponse = <T>(
  {
    data,
    message,
    total,
    limit,
    page,
  }: {
    data: T;
    message: string;
    total: number;
    limit: number;
    page: number;
  },
  res: Response
) =>
  handleResponse(
    {
      data: {
        rows: data,
        total,
        limit,
        page,
        total_pages: Math.ceil(total / limit),
        has_next_page: page < Math.ceil(total / limit),
        has_previous_page: page > 1,
        next_page: page + 1,
        previous_page: page - 1,
      },
      message,
      statusCode: 200,
    },
    res
  );

  export const paginateResponse = <T>(
    {
      data,
      limit,
      page,
      total,
    }: PaginateResponseInput<T>,
    metaData: Record<string, any> = {}
  ): PaginateResponse<T> => {
    return {
      total_pages: Math.ceil(total / limit),
      number_of_rows: data.length,
      current_page: page,
      limit,
      total_records: total,
      paginated_results: data,
      meta: metaData,
    };
  };



export const paginateQuery = (
  query: any,
  options: PaginateQueryOptions = {
    sortingKeys: ["created_at"],
    filterKeys: [],
    defaultSortingKey: "created_at"
  }
): PaginateQueryResult => {

  // const {
  //   sortingKeys = ["created_at"],
  //   //filterKeys = [],
  //   defaultSortingKey = "created_at"
  // } = options;

  const filterKeys = options.filterKeys || [];
  const sortingKeys = options.sortingKeys || ["created_at"];
  const defaultSortingKey = options.defaultSortingKey || "created_at";

  const computedPage = parseInt(query.page) || 1;
  const page = computedPage < 1 ? 1 : computedPage;

  const parsedLimit = parseInt(query.limit) || 10;
  const limit = parsedLimit > 500 ? 500 : parsedLimit;

  const skip = (page - 1) * limit;

  const sortingDirection: 'asc' | 'desc' = (query.sortingDirection?.toUpperCase() === "ASC") ? 'asc' : 'desc';
  const sortingKey = sortingKeys.includes(query.sortingKey) ? query.sortingKey : defaultSortingKey;

  const filterType = filterKeys.includes(query.filterKey) ? query.filterKey : undefined;
  const filterValue = query.filterValue ? query.filterValue : [];

  console.log("filterValue inside==>>>", typeof filterValue);

  let parsedFilterValue: any[] = [];
  if (typeof filterValue === 'string') {
    try{
      parsedFilterValue = JSON.parse(filterValue);
      if (!Array.isArray(parsedFilterValue)) {
        parsedFilterValue = [parsedFilterValue];
      }
    }catch(error){
      parsedFilterValue = [filterValue];
    }  
  }

  return {
    page,
    limit,
    skip,
    sortingDirection,
    sortingKey,
    filterType,
    filterValue: parsedFilterValue
  };
};

export const testSnakeCaseConversion = () => {
  const testData = {
    totalPages: 1,
    numberOfRows: 3,
    currentPage: 1,
    limit: 10,
    totalRecords: 3,
    paginatedResults: [
      {
        id: 3,
        title: "ss",
        description: "ss",
        slug: "ss1",
        status: "Active"
      }
    ],
    meta: {}
  };

  const converted = convertToSnakeCase(testData);
  return converted;
};

