import { Row } from './Components/Row';
import { Card } from './Components/Card';
import { SeverityIndicator } from './Components/Severity';
import { Url } from './Components/Url';
import { Text, Title } from './Components/Base';
import { Badge } from './Components/Badge';
import { DisasterShield } from './Components/DisasterShield';
import { MappingProgress } from './Components/MappingProgress';
import { Field } from './Components/Field';
import { CardHeader } from './Components/CardHeader';
import { IconButton } from './Components/IconButton';
import { Stack } from './Components/Stack';
import { Image } from './Components/Image';
import { PropertyGrid } from './Components/PropertyGrid';

export const componentsRegistry = {
  Card,
  Row,
  Stack,
  CardHeader,

  Title,
  Text,
  Field,
  IconButton,
  Url,
  Badge,
  DisasterShield,
  Image,

  MappingProgress,
  Severity: SeverityIndicator,
  PropertyGrid,
};
