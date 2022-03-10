import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { usePerson } from "@mtfh/common/lib/api/person/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Center,
  ErrorSummary,
  Heading,
  Link,
  Spinner,
} from "@mtfh/common/lib/components";

import "./styles.scss";

const { components } = locale;

const TenureSummary = ({ id }: { id: string }) => {
  const { error, data: tenure } = useTenure(id);

  const tennant = tenure?.householdMembers.find((m) => m.isResponsible);

  if (error) {
    return (
      <ErrorSummary
        id="entity-summary"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!tenure) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Heading className="entity-summary__tenure-heading" variant="h2">
      <div>
        {components.entitySummary.tenurePaymentRef} {tenure?.paymentReference}
      </div>
      <div>{tenure?.tenuredAsset?.fullAddress}</div>
      {tennant && (
        <div>
          <Link as={RouterLink} to={`/person/${tennant.id}`} variant="link">
            {tennant?.fullName}
          </Link>
        </div>
      )}
    </Heading>
  );
};

const AssetsSummary = ({ id }: { id: string }) => {
  const { error, data: asset } = useAsset(id);

  if (error) {
    return (
      <ErrorSummary
        id="entity-summary"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!asset) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <h2 className="lbh-heading-h2">
      {components.entitySummary.address(asset.assetAddress)}
    </h2>
  );
};

const PersonSummary = ({ id }: { id: string }) => {
  const { error, data: person } = usePerson(id);

  if (error) {
    return (
      <ErrorSummary
        id="entity-summary"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!person) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <h2 className="lbh-heading-h2">
      {person?.firstName} {person?.surname}
    </h2>
  );
};

interface EntitySummaryProps {
  id: string;
  type: "tenure" | "property" | "person";
}

export const EntitySummary = ({ id, type }: EntitySummaryProps) => {
  const Components = {
    tenure: TenureSummary,
    property: AssetsSummary,
    person: PersonSummary,
  };
  const Component = Components[type];

  if (!Component) return null;

  return <Component id={id} />;
};
