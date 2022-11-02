import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import { usePerson } from "@mtfh/common/lib/api/person/v1";
import { RelatedEntity } from "@mtfh/common/lib/api/process/v1";
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

interface ComponentProps {
  id: string;
  // eslint-disable-next-line react/no-unused-prop-types
  config?: Record<string, any>;
  // eslint-disable-next-line react/no-unused-prop-types
  setRelatedEntities?: (relatedEntities: RelatedEntity[]) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  setAsset?: (asset: Asset) => void;
}

const TenureSummary = ({
  id,
  config = {},
  setRelatedEntities,
  setAsset,
}: ComponentProps) => {
  const { incomingTenant } = config;
  const { error, data: tenure } = useTenure(id);
  const { data: asset } = useAsset(tenure?.tenuredAsset?.id || null);

  useEffect(() => {
    if (setAsset && asset) {
      setAsset(asset);
    }
  }, [asset, setAsset]);

  const tenant = tenure?.householdMembers?.find((m) => m.isResponsible);

  useEffect(() => {
    if (setRelatedEntities) {
      const relatedEntities: RelatedEntity[] = [];

      if (tenant) {
        relatedEntities.push({
          id: tenant.id,
          targetType: "person",
          subType: "tenant",
          description: tenant.fullName,
        });
      }

      if (tenure) {
        relatedEntities.push({
          id: tenure.id,
          targetType: "tenure",
          description: tenure.paymentReference,
        });
        if (tenure.tenuredAsset) {
          relatedEntities.push({
            id: tenure.tenuredAsset.id,
            targetType: "asset",
            description: tenure.tenuredAsset.fullAddress,
          });
        }
      }

      if (relatedEntities.length > 0) {
        setRelatedEntities(relatedEntities);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

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
      {tenant && (
        <div>
          <Link
            as={RouterLink}
            to={`/person/${tenant.id}`}
            variant="link"
            target="_blank"
          >
            {tenant?.fullName}
          </Link>
          {incomingTenant && ` adding ${incomingTenant.fullName}`}
        </div>
      )}
    </Heading>
  );
};

const AssetsSummary = ({ id, setAsset }: ComponentProps) => {
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

  if (setAsset) {
    setAsset(asset);
  }

  return (
    <h2 className="lbh-heading-h2">
      {components.entitySummary.address(asset.assetAddress)}
    </h2>
  );
};

const PersonSummary = ({ id, setRelatedEntities, setAsset }: ComponentProps) => {
  const { error, data: person } = usePerson(id);

  const fullName = person ? `${person.firstName} ${person.surname}` : "";
  const activeTenure = person?.tenures?.find((tenure) => tenure.isActive);

  const { data: asset } = useAsset(activeTenure?.assetId || null);

  useEffect(() => {
    if (setAsset && asset) {
      setAsset(asset);
    }
  }, [asset, setAsset]);

  useEffect(() => {
    if (setRelatedEntities) {
      const relatedEntities: RelatedEntity[] = [];

      if (person) {
        if (activeTenure) {
          relatedEntities.push({
            id: person.id,
            targetType: "person",
            subType: "tenant",
            description: fullName,
          });
          relatedEntities.push({
            id: activeTenure.id,
            targetType: "tenure",
          });
          relatedEntities.push({
            id: activeTenure.assetId,
            targetType: "asset",
            description: activeTenure.assetFullAddress,
          });
        }
      }

      if (relatedEntities.length > 0) {
        setRelatedEntities(relatedEntities);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

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
      <div>
        <Link as={RouterLink} to={`/person/${person.id}`} variant="link" target="_blank">
          {fullName}
        </Link>
      </div>
    </h2>
  );
};

interface EntitySummaryProps {
  id: string;
  // eslint-disable-next-line react/no-unused-prop-types
  config?: Record<string, any>;
  type: "tenure" | "property" | "person";
  setRelatedEntities?: (relatedEntities: RelatedEntity[]) => void;
  setAsset?: (asset: Asset) => void;
}

export const EntitySummary = ({
  id,
  type,
  config,
  setRelatedEntities,
  setAsset,
}: EntitySummaryProps) => {
  const Components = {
    tenure: TenureSummary,
    property: AssetsSummary,
    person: PersonSummary,
  };
  const Component = Components[type];

  if (!Component) return null;

  return (
    <Component
      id={id}
      config={config}
      setRelatedEntities={setRelatedEntities}
      setAsset={setAsset}
    />
  );
};
