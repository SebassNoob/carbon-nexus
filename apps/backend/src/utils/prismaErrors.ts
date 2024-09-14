import { Prisma } from "@prisma/client";
import { AppError, AppErrorTypes } from "@utils/appErrors";

export function handleDatabaseError(error: unknown): never {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (Object.keys(prismaErrors).includes(error.code)) {
			throw new AppError(prismaErrors[error.code as keyof typeof prismaErrors](error.message));
		}
		throw new AppError(AppErrorTypes.DatabaseError("Unknown", 500, error.message));
	} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
		throw new AppError(AppErrorTypes.DatabaseError("Unknown", 500, error.message));
	} else if (error instanceof Prisma.PrismaClientInitializationError) {
		throw new AppError(AppErrorTypes.Panic(error.message));
	} else if (error instanceof Prisma.PrismaClientValidationError) {
		throw new AppError(AppErrorTypes.Panic(error.message));
	} else if (error instanceof Prisma.PrismaClientRustPanicError) {
		throw new AppError(AppErrorTypes.Panic(error.message));
	}
	throw new AppError(AppErrorTypes.GenericError(String(error)));
}
const prismaErrors = {
	P1000: AppErrorTypes.DatabaseError.bind(undefined, "AuthenticationFailed", 401),
	P1001: AppErrorTypes.DatabaseError.bind(undefined, "DatabaseServerUnreachable", 503),
	P1002: AppErrorTypes.DatabaseError.bind(undefined, "DatabaseServerTimeout", 504),
	P1003: AppErrorTypes.DatabaseError.bind(undefined, "DatabaseFileNotFound", 404),
	P1008: AppErrorTypes.DatabaseError.bind(undefined, "OperationTimeout", 408),
	P1009: AppErrorTypes.DatabaseError.bind(undefined, "DatabaseAlreadyExists", 409),
	P1010: AppErrorTypes.DatabaseError.bind(undefined, "AccessDenied", 403),
	P1011: AppErrorTypes.DatabaseError.bind(undefined, "TlsConnectionError", 500),
	P1012: AppErrorTypes.DatabaseError.bind(undefined, "SchemaValidationError", 400),
	P1013: AppErrorTypes.DatabaseError.bind(undefined, "InvalidDatabaseString", 400),
	P1014: AppErrorTypes.DatabaseError.bind(undefined, "UnderlyingModelNotFound", 404),
	P1015: AppErrorTypes.DatabaseError.bind(undefined, "UnsupportedDatabaseFeatures", 501),
	P1016: AppErrorTypes.DatabaseError.bind(undefined, "IncorrectNumberOfParameters", 400),
	P1017: AppErrorTypes.DatabaseError.bind(undefined, "ServerClosedConnection", 500),
	P2000: AppErrorTypes.DatabaseError.bind(undefined, "ValueTooLong", 400),
	P2001: AppErrorTypes.DatabaseError.bind(undefined, "NonExistent", 404),
	P2002: AppErrorTypes.DatabaseError.bind(undefined, "UniqueConstraintViolation", 409),
	P2003: AppErrorTypes.DatabaseError.bind(undefined, "ForeignKeyConstraintViolation", 409),
	P2004: AppErrorTypes.DatabaseError.bind(undefined, "GenericConstraintViolation", 400),
	P2005: AppErrorTypes.DatabaseError.bind(undefined, "DatatypeConstraintViolation", 400),
	P2006: AppErrorTypes.DatabaseError.bind(undefined, "DataInsertFailure", 400),
	P2007: AppErrorTypes.DatabaseError.bind(undefined, "DataValidationFailure", 400),
	P2008: AppErrorTypes.DatabaseError.bind(undefined, "QueryParseError", 400),
	P2009: AppErrorTypes.DatabaseError.bind(undefined, "QueryValidationError", 400),
	P2010: AppErrorTypes.DatabaseError.bind(undefined, "RawQueryFailed", 400),
	P2011: AppErrorTypes.DatabaseError.bind(undefined, "NullConstraintViolation", 400),
	P2012: AppErrorTypes.DatabaseError.bind(undefined, "MissingRequiredValue", 400),
	P2013: AppErrorTypes.DatabaseError.bind(undefined, "MissingRequiredArgument", 400),
	P2014: AppErrorTypes.DatabaseError.bind(undefined, "RequiredRelationViolation", 400),
	P2015: AppErrorTypes.DatabaseError.bind(undefined, "RelatedRecordNotFound", 404),
	P2016: AppErrorTypes.DatabaseError.bind(undefined, "QueryInterpretationError", 400),
	P2017: AppErrorTypes.DatabaseError.bind(undefined, "RelationNotConnected", 400),
	P2018: AppErrorTypes.DatabaseError.bind(undefined, "RequiredConnectedRecordsNotFound", 404),
	P2019: AppErrorTypes.DatabaseError.bind(undefined, "InputError", 400),
	P2020: AppErrorTypes.DatabaseError.bind(undefined, "ValueOutOfRange", 400),
	P2021: AppErrorTypes.DatabaseError.bind(undefined, "TableDoesNotExist", 404),
	P2022: AppErrorTypes.DatabaseError.bind(undefined, "ColumnDoesNotExist", 404),
	P2023: AppErrorTypes.DatabaseError.bind(undefined, "InconsistentColumnData", 400),
	P2024: AppErrorTypes.DatabaseError.bind(undefined, "ConnectionPoolTimeout", 504),
	P2025: AppErrorTypes.DatabaseError.bind(undefined, "OperationFailedDueToMissingRecords", 400),
	P2026: AppErrorTypes.DatabaseError.bind(undefined, "UnsupportedFeature", 501),
	P2027: AppErrorTypes.DatabaseError.bind(undefined, "MultipleDatabaseErrors", 500),
	P2028: AppErrorTypes.DatabaseError.bind(undefined, "TransactionApiError", 500),
	P2029: AppErrorTypes.DatabaseError.bind(undefined, "QueryParameterLimitExceeded", 400),
	P2030: AppErrorTypes.DatabaseError.bind(undefined, "FulltextIndexNotFound", 400),
	P2031: AppErrorTypes.DatabaseError.bind(undefined, "MongoDbReplicaSetRequired", 500),
	P2033: AppErrorTypes.DatabaseError.bind(undefined, "NumberOutOf64BitRange", 400),
	P2034: AppErrorTypes.DatabaseError.bind(undefined, "TransactionWriteConflict", 409),
	P2035: AppErrorTypes.DatabaseError.bind(undefined, "DatabaseAssertionViolation", 500),
	P2036: AppErrorTypes.DatabaseError.bind(undefined, "ExternalConnectorError", 500),
	P2037: AppErrorTypes.DatabaseError.bind(undefined, "TooManyDatabaseConnections", 500),
};
