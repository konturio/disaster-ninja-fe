import { Row } from './Components/Row';
import { Card } from './Components/Card';
import { SeverityIndicator } from './Components/Severity';
import { Url } from './Components/Url';
import { Text, Title } from './Components/Base';
import { Badge } from './Components/Badge';
import { MappingProgress } from './Components/MappingProgress';
import { Field } from './Components/Field';
import { CardHeader } from './Components/CardHeader';
import { IconButton } from './Components/IconButton';

export const componentsRegistry = {
  Card,
  Row,
  CardHeader,

  Title,
  Text,
  Field,
  IconButton,
  Url,
  Badge,

  MappingProgress,
  Severity: SeverityIndicator,
};
